import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
}

/**
 * Đăng nhập bằng email và mật khẩu
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email
    };
  } catch (error: any) {
    console.error('Lỗi đăng nhập:', error);
    
    // Chuyển đổi Firebase error code thành tiếng Việt
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error('Không tìm thấy tài khoản với email này');
      case 'auth/wrong-password':
        throw new Error('Mật khẩu không chính xác');
      case 'auth/invalid-email':
        throw new Error('Email không hợp lệ');
      case 'auth/user-disabled':
        throw new Error('Tài khoản đã bị vô hiệu hóa');
      case 'auth/too-many-requests':
        throw new Error('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau');
      default:
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại');
    }
  }
}

/**
 * Đăng xuất
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    throw new Error('Đăng xuất thất bại');
  }
}

/**
 * Lắng nghe trạng thái đăng nhập
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email
      });
    } else {
      callback(null);
    }
  });
}

/**
 * Lấy user hiện tại
 */
export function getCurrentUser(): AuthUser | null {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email
    };
  }
  return null;
} 