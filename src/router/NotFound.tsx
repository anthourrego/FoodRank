import NotFound from "@/components/router/not-found";
import type { ReactNode } from "react";
import { Route, Routes } from "react-router";
interface Props {
  children: ReactNode
}

export function RoutesNotFound({children}:Props){
  return(
    <Routes>
      {children}
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}