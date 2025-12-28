'use client'
import React from 'react'
import { sendGAEvent } from '@next/third-parties/google'
export default function TestButton() {
  return (
    <button onClick={()=> sendGAEvent({ event: ' buttonClicked', value:'xyz'})}>Send Event</button>
  )
}
