// app/[userId]/page.jsx
import Profile from '../components/Profile';

export default async function Page({ params }) {
  const resolvedParams = await params; // params Promise를 기다림
  if (!resolvedParams?.userId) {
    return <div>오류: userId가 없습니다</div>;
  }

  const decodedUserId = decodeURIComponent(resolvedParams.userId);
  return <Profile userId={decodedUserId} />;
}