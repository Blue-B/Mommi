"use client"
import Image from 'next/image'

import { useSession, signIn, signOut } from "next-auth/react"
import { collection, getDocs, getFirestore, query, orderBy, limit, startAfter } from 'firebase/firestore';
import app from './Shared/firebaseConfig';
import { useEffect, useState, useContext } from 'react';
import PinList from './components/Pins/PinList';
import { SearchContext } from './Providers';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 20;

export default function Home() {
  const db = getFirestore(app);
  const [listOfPins, setListOfPins] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const { searchTerm } = useContext(SearchContext);
  
  useEffect(() => {
    getInitialPins();
  }, [searchTerm]);

  const getInitialPins = async () => {
    const q = query(
      collection(db, 'clipo-post'),
      orderBy('id', 'desc'),
      limit(PAGE_SIZE)
    );
    const querySnapshot = await getDocs(q);
    const pins = [];
    querySnapshot.forEach((doc) => {
      pins.push(doc.data());
    });
    setListOfPins(pins);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === PAGE_SIZE);
  };

  const fetchMorePins = async () => {
    if (!lastDoc) return;
    const q = query(
      collection(db, 'clipo-post'),
      orderBy('id', 'desc'),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );
    const querySnapshot = await getDocs(q);
    const pins = [];
    querySnapshot.forEach((doc) => {
      pins.push(doc.data());
    });
    setListOfPins((prev) => [...prev, ...pins]);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === PAGE_SIZE);
  };

  const filteredPins = listOfPins.filter(pin =>
    pin.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='p-3'>
        <InfiniteScroll
          dataLength={filteredPins.length}
          next={fetchMorePins}
          hasMore={hasMore}
          loader={<div className="flex justify-center py-6"><span className="loader"></span></div>}
          endMessage={<div className="text-center text-gray-400 py-6">모든 핀을 다 불러왔어요!</div>}
        >
          <PinList listOfPins={filteredPins} />
        </InfiniteScroll>
      </div>
    </>
  )
}