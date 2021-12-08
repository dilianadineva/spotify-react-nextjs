import { getProviders, signIn } from 'next-auth/react'

import React from 'react'

function Login(props) {
    const {providers} = props
    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" />
            {/* {JSON.stringify(providers)} */}
            {Object.values(providers).map((provider)=>{
                return (
                    <div key={provider.name}>
                        <button className="bg-[#18D860] text-white p-6 rounded-full"
                        onClick={()=> signIn(provider.id, {callbackUrl: "/"})}
                        >
                            Log in with {provider.name}
                            </button>
                    </div>
                )
            })}
        </div>
    )
}

export default Login

export async function getServerSideProps(){
    const providers = await getProviders()
    return {
        props: {
            providers
        }
    }
}
