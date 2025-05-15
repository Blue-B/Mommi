// components/Profile.jsx
"use client";
import React, { useEffect, useState, useContext } from 'react';
import app from '../Shared/firebaseConfig';
import { collection, getDocs, getDoc, doc, getFirestore, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import UserInfo from './UserInfo';
import PinList from './../components/Pins/PinList'
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 20;

function Profile({ userId }) {
  const db = getFirestore(app);
  const [userInfo, setUserInfo] = useState();
  const [listOfPins, setListOfPins] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userId) {
      getUserInfo(userId);
    }
  }, [userId]);

  const getUserInfo = async (email) => {
    try {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getInitialPins();
    }
    // eslint-disable-next-line
  }, [userInfo])

  const getInitialPins = async () => {
    const q = query(
      collection(db, 'clipo-post'),
      where("email", '==', userInfo.email),
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
      where("email", '==', userInfo.email),
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

  return (
    <div>
      {userInfo ? (
        <>
          <UserInfo userInfo={userInfo} />
          <div className="px-3 md:px-5">
            <InfiniteScroll
              dataLength={listOfPins.length}
              next={fetchMorePins}
              hasMore={hasMore}
              loader={<div className="flex justify-center py-6"><span className="loader"></span></div>}
              endMessage={<div className="text-center text-gray-400 py-6">모든 핀을 다 불러왔어요!</div>}
            >
              <PinList listOfPins={listOfPins} />
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
