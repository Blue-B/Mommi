import React from 'react'
import UserTag from '../UserTag'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { doc, deleteDoc, getFirestore } from 'firebase/firestore'
import app from '@/app/Shared/firebaseConfig'

function PinInfo({pinDetail}) {
  const { data: session } = useSession();
  const router = useRouter();
  const db = getFirestore(app);

  const user={
    name:pinDetail.userName,
    email:pinDetail.email,
    image:pinDetail.userImage
  }

  const handleOpenUrl = () => {
    if (pinDetail.link) {
      window.open(pinDetail.link, '_blank');
    }
  }

  const handleDelete = async () => {
    if (window.confirm('정말로 이 핀을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'clipo-post', pinDetail.id));
        router.push('/');
      } catch (error) {
        console.error("Error deleting pin:", error);
        alert('핀 삭제 중 오류가 발생했습니다.');
      }
    }
  }

  return (
    <div>
      <h2 className='text-[30px] font-bold mb-10'>{pinDetail.title}</h2>
      <UserTag user={user} />
      <h2 className='mt-10'>{pinDetail.desc}</h2>
      <div className='flex flex-col sm:flex-row gap-4 mt-10 w-full'>
        {pinDetail.link && (
          <button 
            className='p-2 bg-[#e9e9e9] px-5 text-[18px] sm:text-[23px] w-full sm:w-auto rounded-full hover:scale-105 transition-all text-center'
            onClick={handleOpenUrl}
          >
            Open Url
          </button>
        )}
        {session?.user?.email === pinDetail.email && (
          <button 
            className='p-2 bg-red-500 text-white px-5 text-[18px] sm:text-[23px] w-full sm:w-auto rounded-full hover:scale-105 transition-all text-center'
            onClick={handleDelete}
          >
            Delete Pin
          </button>
        )}
      </div>
    </div>
  )
}

export default PinInfo