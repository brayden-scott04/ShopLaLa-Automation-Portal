import { StaffSkillsView } from "@/components/team/staff-skills-view";

export default async function StaffSkillsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <StaffSkillsView username={decodeURIComponent(username)} />;
}
