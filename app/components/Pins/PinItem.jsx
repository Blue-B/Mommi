import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import UserTag from '../UserTag'
import { useRouter } from 'next/navigation'
import ColorThief from 'color-thief-browser'

function PinItem({pin}) {
  const router=useRouter();
  console.log("🔥 PIN:", pin);
  const user={
      name:pin?.userName,
      image:pin?.userImage,
  }
  const imgRef = useRef(null);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    if (imgRef.current && pin.image) {
      const img = imgRef.current;
      if (img.complete) {
        extractColors();
      } else {
        img.onload = extractColors;
      }
    }
    // eslint-disable-next-line
  }, [pin.image]);

  const extractColors = async () => {
    try {
      const palette = await ColorThief.getPalette(imgRef.current, 3);
      setColors(palette.map(rgb => rgbToHex(rgb[0], rgb[1], rgb[2])));
    } catch (e) {
      setColors([]);
    }
  };

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  return (
    <div className="break-inside-avoid w-full mb-6">
       <div className="relative w-full
            before:absolute
            before:h-full before:w-full
            before:rounded-3xl
            before:z-10
            hover:before:bg-gray-600 
            before:opacity-50
            cursor-pointer"
            onClick={() => router.push("/pin/" + pin.id)}
        >
          {/* next/image는 crossOrigin 이슈로 색상 추출이 안될 수 있으니 img 태그 사용 */}
          <img
            ref={imgRef}
            src={pin.image}
            alt={pin.title}
            className="rounded-3xl cursor-pointer relative z-0 w-full h-auto object-contain"
            style={{maxHeight: 'none'}}
          />
        </div>
        <div className="flex gap-2 mt-2">
          {colors.map((color, idx) => (
            <div key={color} className="w-6 h-6 rounded-full border" style={{background: color}} title={color}></div>
          ))}
        </div>
        <h2 className='font-bold text-[18px] mb-1 mt-2 line-clamp-2'>{pin.title}</h2>
        <UserTag user={user} />
    </div>
  )
}

export default PinItem