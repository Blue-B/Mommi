"use client"
import { SessionProvider } from 'next-auth/react'
import React, { createContext, useState, ReactNode } from 'react'

export const SearchContext = createContext({ searchTerm: "", setSearchTerm: (v: string) => {} });

function Providers({children}: {children: ReactNode}) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <SessionProvider>
      <SearchContext.Provider value={{searchTerm, setSearchTerm}}>
        {children}
      </SearchContext.Provider>
    </SessionProvider>
  )
}

export default Providers