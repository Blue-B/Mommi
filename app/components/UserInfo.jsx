import Image from 'next/image';
import React from 'react'
import { signOut,useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';

function UserInfo({userInfo}) {
    console.log(userInfo);

    const {data:session}=useSession()
    const router = useRouter();
    const onLogoutClick=()=>{
        signOut({ callbackUrl: "/" });
    }
    const onShareClick = () => {
      const url = window.location.origin + '/' + encodeURIComponent(userInfo.email);
      navigator.clipboard.writeText(url);
      alert('프로필 URL이 복사되었습니다! 친구에게 공유해보세요.');
    }
  return (
    <div className='flex flex-col items-center'>
        {userInfo?.userImage && (
        <Image src={userInfo.userImage}
        alt='userImage'
        width={100}
        height={100}
        className='rounded-full'/>)}

        <h2 className='text-[30px]
        font-semibold'>{userInfo.userName}</h2>
        <h2 className='text-gray-400'>{userInfo.email}</h2>
        <div className='flex gap-4 mt-5 mb-8'>
        <button className='bg-gray-200 p-2 px-3 font-semibold rounded-full cursor-pointer hover:bg-gray-300 transition-all' onClick={onShareClick}>Share</button>
        {session?.user.email== userInfo.email? <button className='bg-gray-200 p-2 px-3 font-semibold rounded-full cursor-pointer hover:bg-gray-300 transition-all' onClick={onLogoutClick}>Logout</button>:null}
      </div>
    </div>
  )
}

export default UserInfo