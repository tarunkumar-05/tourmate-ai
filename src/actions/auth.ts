'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
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
  await signOut({ redirectTo: '/' });
}

export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard' });
}

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_APP_PASSWORD // Your Gmail App Password
  }
});

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

    // Send real email using Nodemailer & Gmail
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: `"TourMate AI" <${process.env.EMAIL_USER}>`,
          to: email, // This will now send to ANY email address!
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
      } catch (emailError: any) {
        console.error('Nodemailer Error:', emailError);
        return { success: false, error: `Email failed to send: ${emailError.message}` };
      }
    } else {
      console.warn('EMAIL_USER or EMAIL_APP_PASSWORD is not set. Email not sent. Reset link:', resetLink);
      return { success: false, error: 'Server configuration error: Gmail service is not set up in Vercel.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Failed to generate reset link. Please try again later.' };
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
