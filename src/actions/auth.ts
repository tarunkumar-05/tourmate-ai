'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export async function registerUser(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { success: false, error: 'Email already exists' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role.toUpperCase(),
        profile: {
          create: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            languages: data.languages ? data.languages.split(',').map((l:string) => l.trim()) : [],
          }
        }
      }
    });

    if (data.role === 'guide') {
      await prisma.guideProfile.create({
        data: {
          userId: user.id,
          university: data.university || 'Not Provided',
          studentId: data.studentId || 'Not Provided',
          specializations: [],
          availableDays: [],
        }
      });
      revalidateTag('guides_all', 'default');
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register' };
  }
}

export async function login(prevState: any, formData: FormData) {
  try {
    revalidatePath('/', 'layout');
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.' };
        default:
          return { error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}

export async function logout() {
  revalidatePath('/', 'layout');
  await signOut({ redirectTo: '/' });
}

export async function loginWithGoogle() {
  revalidatePath('/', 'layout');
  await signIn('google', { redirectTo: '/dashboard' });
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true }; // Don't reveal user existence

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Generate token
    const token = Array.from({ length: 32 }, () => Math.random().toString(36).substring(2)).join('').substring(0, 32);
    
    // Set expiration 1 hour from now
    const expires = new Date(Date.now() + 3600000);

    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // Send real email using Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'TourMate AI <noreply@tourmate-ai.com>', // Use your verified Resend domain here in production
        to: email,
        subject: 'Reset your TourMate AI password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hi ${user.name || 'there'},</p>
            <p>Someone requested a password reset for your TourMate AI account. If this was you, click the button below to set a new password:</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `
      });
    } else {
      console.warn('RESEND_API_KEY is not set. Email not sent. Reset link:', resetLink);
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to send reset email. Please try again later.' };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    
    if (!resetToken || resetToken.expires < new Date()) {
      return { success: false, error: 'Invalid or expired token' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash }
    });

    // Clean up used token
    await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Something went wrong' };
  }
}
