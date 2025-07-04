'use client'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


export default function UserProfile({params}: any){
    const router = useRouter()
    const [data, setData] = useState("nothing")
    const logout = async () =>{
        try {
            await axios.get('/api/users/logout')
            toast.success('Logout successfully')
            router.push('/login')
            
        } catch (error:any) {
            console.log(error.message)
            toast.error(error.message)
        }

    }
    const getUserDetails = async () =>{
        const res = await axios.get('/api/users/me')
        console.log(res.data)
        setData(res.data.data._id)
    }

    return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>
            <p className="text-4xl">Profile page {params.id}</p>
        </h1>
        <h2 className='p-3 rounded bg-green-500'>{data==="nothing" ? "Nothing here":<Link href={`/profile/${data}`}>{data}</Link>}</h2>
        <hr/>
        <button
        onClick={logout}
        className="p-2 bg-blue-500 text-white rounded-lg mb-4 disabled:opacity-50"
        >Logout</button>
        <button
        onClick={getUserDetails}
        className="p-2 bg-green-800 text-white rounded-lg mb-4 disabled:opacity-50"
        >Get User Details</button>
    </div>
    )
}