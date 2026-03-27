export type LoggedInUser = {
  id: number;
  fullName: string;
  nim: string;
  email: string;
  role: string;
  photoUrl?: string | null;
};