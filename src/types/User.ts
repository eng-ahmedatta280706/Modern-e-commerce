export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  address?: string;
  phoneNumber?: string;
  profilePic?: string;
  ordersCount?: number;
  role?: 'admin' | 'customer';
  createdAt?: string;
}

export interface AuthUser extends User {
  token?: string;
}

export const DEFAULT_GUEST_USER: User = {
  id: 'guest',
  name: 'Guest User',
  username: 'guest123',
  email: 'guest@example.com',
  profilePic: 'https://i.postimg.cc/MZ31Q10k/avatar.jpg',
  ordersCount: 0,
};
