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

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true }; // Don't reveal user existence

    // Delete old tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    // Generate token (simple random string for demo)
    const token = Array.from({ length: 32 }, () => Math.random().toString(36).substring(2)).join('').substring(0, 32);
    
    // Set expiration 1 hour from now
    const expires = new Date(Date.now() + 3600000);

    await prisma.passwordResetToken.create({
      data: { email, token, expires }
    });

    // In a real app, send an email here. 
    // For this demo MVP, we will just return the token to the UI so it can auto-redirect!
    return { success: true, mockTokenForDemo: token };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: 'Something went wrong' };
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
