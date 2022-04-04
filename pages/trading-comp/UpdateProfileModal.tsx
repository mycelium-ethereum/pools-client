import React, { useState } from 'react';
import Button from '~/components/General/Button';
import { InputContainer } from '~/components/General/Input';
import { TWModal } from '~/components/General/TWModal';

const UpdateProfileModal: React.FC<{ isOpen: boolean; handleClose: () => void }> = ({
    isOpen,
    handleClose,
}: {
    isOpen: boolean;
    handleClose: () => void;
}) => {
    const [verified, setVerified] = useState(false);
    const [username, setUsername] = useState('');

    // Change this once proper API is implemented
    const handleVerify = () => {
        setVerified(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    return (
        <TWModal
            open={isOpen}
            onClose={handleClose}
            className="sm:max-w-[545px] sm:w-[545px] flex flex-col justify-start"
        >
            <button onClick={handleClose}>
                <img src="/img/general/close.svg" className="w-4 h-4 absolute top-9 right-8 invert" />
            </button>
            <div className="text-center w-full">
                <span className="text-xl leading-[150%] font-bold w-full">Update your profile</span>
                <hr className="border-cool-gray-700 w-full mt-4" />
                <div className="max-w-[365px] mt-12 mx-auto">
                    <p>Add your name and profile picture to your trading profile to show off your gains!</p>
                </div>
                {!verified ? (
                    <>
                        <div className="max-w-[365px] mt-4 mx-auto">
                            <p>Verify your address first. </p>
                        </div>
                        <Button variant="primary" size="lg" className="mt-8" onClick={handleVerify}>
                            Verify my address
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="mb-8 mt-4 text-tracer-green flex items-center w-max mx-auto">
                            <img src="/img/trading-comp/check-circle.svg" className="w-5 h-5 mr-2.5" />
                            <span>Address Verified!</span>
                        </div>
                        <div className="mb-10">
                            <span className="w-full font-medium">Username</span>
                            <InputContainer className="mt-2.5">
                                <input
                                    className="w-full h-full font-normal text-base text-center relative outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary focus:border"
                                    value={username}
                                    onChange={handleChange}
                                    placeholder="Input username"
                                />
                            </InputContainer>
                        </div>
                        <div>
                            <span className="w-full font-medium">Display Picture</span>
                            <img
                                src="/img/trading-comp/file-upload-circle.svg"
                                className="w-[200px] h-[200px] mt-2 mx-auto dark:block hidden"
                            />
                            <img
                                src="/img/trading-comp/file-upload-circle-light.svg"
                                className="w-[200px] h-[200px] mt-2 mx-auto dark:hidden block"
                            />
                        </div>
                        <Button variant="primary" size="lg" className="mt-8" onClick={handleClose}>
                            Update Profile
                        </Button>
                    </>
                )}
            </div>
        </TWModal>
    );
};

export default UpdateProfileModal;
