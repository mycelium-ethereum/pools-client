import React from 'react';

const EditProfile: React.FC<{
    name: string;
    avatar: string;
    handleOpen: () => void;
}> = ({ name, avatar, handleOpen }: { name: string; avatar: string; handleOpen: () => void }) => {
    return (
        <div className="flex flex-col items-end sm:flex-row sm:items-center">
            <div className="flex items-center">
                <img src={avatar} className="mr-1 h-5 w-5 rounded-full" />
                <span className="text-sm font-bold text-cool-gray-900 dark:text-white">{name}</span>
            </div>
            <button onClick={handleOpen}>
                <span className="ml-2 inline-block text-sm text-purple-300 underline">Edit Profile</span>
            </button>
        </div>
    );
};

export default EditProfile;
