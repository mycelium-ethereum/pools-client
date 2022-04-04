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
            className="flex flex-col justify-start sm:w-[545px] sm:max-w-[545px]"
        >
            <button onClick={handleClose}>
                <img src="/img/general/close.svg" className="absolute top-9 right-8 h-4 w-4 invert" />
            </button>
            <div className="w-full text-center">
                <span className="w-full text-xl font-bold leading-[150%]">Update your profile</span>
                <hr className="mt-4 w-full border-cool-gray-700" />
                <div className="mx-auto mt-12 max-w-[365px]">
                    <p>Add your name and profile picture to your trading profile to show off your gains!</p>
                </div>
                {!verified ? (
                    <>
                        <div className="mx-auto mt-4 max-w-[365px]">
                            <p>Verify your address first. </p>
                        </div>
                        <Button variant="primary" size="lg" className="mt-8" onClick={handleVerify}>
                            Verify my address
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-8 mt-4 flex w-max items-center text-tracer-green">
                            <img src="/img/trading-comp/check-circle.svg" className="mr-2.5 h-5 w-5" />
                            <span>Address Verified!</span>
                        </div>
                        <div className="mb-10">
                            <span className="w-full font-medium">Username</span>
                            <InputContainer className="mt-2.5">
                                <input
                                    className="outline-none placeholder-low-emphesis focus:placeholder-primary relative h-full w-full flex-auto overflow-hidden overflow-ellipsis border-none text-center text-base font-normal focus:border"
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
                                className="mx-auto mt-2 hidden h-[200px] w-[200px] dark:block"
                            />
                            <img
                                src="/img/trading-comp/file-upload-circle-light.svg"
                                className="mx-auto mt-2 block h-[200px] w-[200px] dark:hidden"
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
