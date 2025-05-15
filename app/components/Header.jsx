"use client"
import React, { useEffect, useContext } from 'react'
import Image from 'next/image'
import { HiSearch,HiBell,HiChat } from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react"
import app from '../Shared/firebaseConfig';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { useRouter } from 'next/navigation';
import { SearchContext } from '../Providers';

function Header() {
    const { data: session } = useSession();
    const router = useRouter();
    const db = getFirestore(app);
    const { searchTerm, setSearchTerm } = useContext(SearchContext);

    useEffect(()=>{
      saveUserInfo();
    },[session])

    const saveUserInfo= async ()=>{
      if(session?.user)
      {
        await setDoc(doc(db, "users", session.user.email), {
          userName: session.user.name,
          email: session.user.email,
          userImage: session.user.image
        });
      }
    }

    const onCreateClick=()=>{
      if(session)
      {
        router.push('/clip-builder')
      }
      else{
        signIn()
      }
    }

    const handleHomeClick = () => {
      router.refresh();
    }

    return (
      <div className='flex justify-between 
       gap-3 md:gap-2 items-center p-6 '>
          <Image src='/logo.png' alt='logo'
          width={50} height={50} onClick={()=>router.push('/')}
          className='hover:bg-gray-300 p-2
          rounded-full cursor-pointer'/>
          <button className='bg-black text-white p-2 px-4 rounded-full hidden md:block 
            transition-all duration-150
            hover:bg-gray-800 hover:scale-105
            active:bg-gray-900 active:scale-95
            cursor-pointer' 
            onClick={() => router.push('/')}>Home</button>
          <button className='font-semibold p-2 px-4 rounded-full 
            transition-all duration-150
            hover:bg-gray-200 hover:scale-105
            active:bg-gray-300 active:scale-95
            cursor-pointer'
           onClick={()=>onCreateClick()}>Create</button>
          <div className='bg-[#e9e9e9] p-3 px-6
           gap-3 items-center rounded-full w-full hidden md:flex'>
          <HiSearch className='text-[34px] 
          text-gray-500'/>
          <input type="text" placeholder='Search'
          className='bg-transparent outline-none w-full text-[25px]'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          />
         
          </div>
          <HiSearch className='text-[25px] 
          text-gray-500 md:hidden'/>
          <HiBell className='text-[25px] md:text-[60px] text-gray-500 cursor-pointer'/>
          <HiChat className='text-[25px] md:text-[60px] text-gray-500 cursor-pointer'/>
        {session?.user?  
        <Image src={session.user.image} 
         onClick={()=>router.push('/'+session.user.email)}
        alt='user-image' width={60} height={60}
          className='hover:bg-gray-300 p-2
          rounded-full cursor-pointer'/>:
  
          <button className='font-semibold p-2 px-4 rounded-full'
           onClick={() => signIn()}>Login</button>}
  
  
  
      </div>
    )
  }

export default Header