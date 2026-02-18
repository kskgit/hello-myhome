import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ProfileForm initialData={null} />
    </div>
  );
}
