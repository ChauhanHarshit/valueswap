import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import BlueGradientButton from '../../buttons/BlueGradientButton';
import { toggleConfirm } from '../../reducer/PoolCreation';
import GradientButton from '../../buttons/GradientButton';
import { useAuth } from '../../components/utils/useAuthClient';


const FinalizePool = ({ handleCreatePoolClick }) => {
    const { Tokens, Confirmation, TotalAmount, FeeShare } = useSelector((state) => state.pool)
    const dispatch = useDispatch()
    const [confirmPool, setConfirmPool] = useState(false)
    const [poolCreated, setPoolCreated] = useState(false)
    const [final, setFinal] = useState(false)
    const [selectedTokenDetails, setSelectedTokenDetails] = useState()
    useEffect(() => {
        if (confirmPool && poolCreated) {
            setFinal(true)
        }
    }, [confirmPool, poolCreated])
    let InitialToken = Tokens[0]

    let RestTokens = Tokens.slice(1)

    const { backendActor, isAuthenticated } = useAuth()
    // valueswap_backend.create_pools({

    // })\

    const createPoolHandler = async () => {
        console.log("You clicked to create pool");
    
        // Check if Tokens array is valid
        if (!Tokens || Tokens.length === 0) {
            console.error("No tokens available to create a pool");
            return;
        }
    
        // Map tokens data into the required format for pool_data
        const pool_data = Tokens.map(token => ({
            weight: parseFloat(token.weights / 100),  // Ensure weight is float64
            balance: BigInt(token.Amount),  // nat64 requires BigInt in JavaScript
            value: BigInt(Math.round(token.currencyAmount)),  // nat64 requires BigInt
            image: token.ImagePath || "",  // Ensure image is a string
            token_name: token.ShortForm || "Unnamed Token"  // Ensure token name is a string
        }));
    
        // Ensure swap fee is valid and convert it
        const swap_fee = parseFloat(FeeShare);
        if (isNaN(swap_fee)) {
            console.error("Invalid swap fee:", FeeShare);
            return;
        }
    
        // Combine pool_data and swap_fee into the expected structure
        const poolDetails = { pool_data, swap_fee };
        setSelectedTokenDetails(pool_data); // Update state with the pool data
        console.log("poolDetails:", poolDetails);
    
        try {
            if (!backendActor || !backendActor.create_pools) {
                console.error("Backend actor is not available or create_pools method is missing");
                return;
            }
    
            // Call the backend to create the pool
            const result = await backendActor.create_pools(poolDetails);
            
            if (result && result.Ok) {
                console.log("Pool created successfully");
                setPoolCreated(true); // Update state on success
            } else if (result && result.Err) {
                console.error("Error creating pool:", result.Err); // Log the error message from the backend
            } else {
                console.error("Unexpected response from backend:", result); // Log any unexpected response
            }
    
        } catch (error) {
            console.error("Error while creating pool", error);
        }
    };
    


    console.log("isAuthenticated", isAuthenticated)


    return (
        <div className='flex z-50 justify-center fixed inset-0  bg-opacity-50 backdrop-blur-sm py-10 overflow-y-scroll'>
            <div className=' h-fit xl:w-5/12 lg:w-6/12 md:w-7/12 sm:w-8/12 w-11/12 border rounded-xl flex flex-col gap-2 bg-[#05071D] my-auto   '>

                <div className='md:w-[64%] w-[62%] flex place-self-end items-center justify-between mx-4'>
                    <span className='font-fahkwang font-medium md:text-2xl text-xl py-4'>Analyse Pair</span>
                    <div className='cursor-pointer'
                        onClick={() => {
                            console.log("dispatched called")
                            dispatch(toggleConfirm({
                                value: false,
                                page: "Final Page"
                            }))
                            console.log("dispatched finished")
                        }}><X /></div>
                </div>
                <div className='border border-transparent font-bold custom-height-3 bg-gradient-to-r from-transparent via-[#00308E] to-transparent w-full mx-auto mb-4'></div>

                {
                    Tokens.map((token, index) => (
                        <div className=' mx-3 sm:mx-10' key={index}>

                            <div className='flex justify-between items-center font-cabin'>
                                <div className='flex justify-evenly items-center gap-2'>

                                    <BlueGradientButton>
                                        <img src={token.ImagePath} alt="" className='h-12 w-12 ' />
                                    </BlueGradientButton>

                                    <div>
                                        {token.ShortForm}
                                    </div>

                                    <span className='bg-[#3E434B] p-1 rounded-lg px-3'>
                                        {token.weights}   %
                                    </span>
                                </div>


                                <div className='flex flex-col justify-center items-center'>
                                    <div className='text-center'>
                                        <span className="font-normal leading-5 text-xl sm:text-3xl px-2 py-1 inline-block" >
                                            {token.Amount}
                                        </span>

                                    </div>
                                    <span className='text-sm sm:text-base font-normal '>
                                        $  {token.currencyAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className='border border-transparent font-bold custom-height-3 bg-gradient-to-r from-transparent via-[#00308E] to-transparent w-full mx-auto mb-4'></div>

                <div className='flex justify-between font-cabin font-light text-base mx-10'>
                    <span >
                        Total
                    </span>

                    <span>
                        $  {TotalAmount}
                    </span>
                </div>

                <h1 className='text-center font-fahkwang font-medium text-xl leading-5 '>Overview</h1>
                <div className='border border-transparent font-bold custom-height-3 bg-gradient-to-r from-transparent via-[#00308E] to-transparent w-full mx-auto mb-4'></div>

                <div className='flex justify-between font-cabin font-normal text-sm sm:text-base mx-5 sm:mx-10'>

                    <span>Pool Symbol</span>

                    <div className='leading-6 inline-block items-center text-center'>

                        <span className='inline'>{InitialToken.ShortForm}</span>
                        {
                            RestTokens.map((token, index) => (
                                <span key={index}> / {token.ShortForm}</span>
                            ))
                        }

                        <span className='inline mx-1 '>: :</span>

                        <span className='inline'>{InitialToken.weights}</span>

                        {
                            RestTokens.map((token, index) => (
                                <span key={index}> / {token.weights}</span>
                            ))
                        }
                    </div>

                </div>
                <div className='flex justify-between font-cabin font-normal text-sm sm:text-base mx-5 sm:mx-10'>

                    <span>Pool Name</span>

                    <div className='leading-6 inline-block items-center text-center'>

                        <span className='inline'>{InitialToken.ShortForm}</span>
                        {
                            RestTokens.map((token, index) => (
                                <span key={index}> / {token.ShortForm}</span>
                            ))
                        }

                        <span className='inline mx-1 '>: :</span>

                        <span className='inline'>{InitialToken.weights}</span>

                        {
                            RestTokens.map((token, index) => (
                                <span key={index}> / {token.weights}</span>
                            ))
                        }
                    </div>

                </div>

                <div className='flex justify-between font-cabin font-normal text-sm sm:text-base mx-5 sm:mx-10'>

                    <span>Pool Fee Share</span>

                    <div className='leading-6 inline-block items-center text-center'>
                        {FeeShare}  %
                    </div>

                </div>


                <div className={`mx-10 mb-4`}>
                    <div className={`${confirmPool ? 'hidden' : 'block'}`}
                        onClick={async () => {
                            setConfirmPool(true)
                            handleCreatePoolClick("ctiya-peaaa-aaaaa-qaaja-cai")
                            createPoolHandler()
                        }}>
                        <GradientButton CustomCss={` w-full md:w-full`} >
                            Confirm and Create Pool
                        </GradientButton>
                    </div>

                    <div className={`${confirmPool ? 'block enabled' : 'hidden disabled'} ${poolCreated ? 'hidden disabled' : 'block '}`}
                        onClick={() => {
                            setPoolCreated(true)
                            console.log("Tokens in the pool Data:->", Tokens)
                        }}
                    >
                        <GradientButton CustomCss={` w-full md:w-full`}>
                            Supply Funds
                        </GradientButton>
                    </div>

                    <div className={`${final ? 'block' : 'hidden'}`}>
                        <GradientButton CustomCss={` w-full md:w-full`}>
                            View Pool
                        </GradientButton>
                    </div>

                </div>

            </div>

        </div >
    )
}

export default FinalizePool
