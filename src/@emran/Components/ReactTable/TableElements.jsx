import {IoRefreshOutline} from "react-icons/io5";

export const NoDataFound = () => (
    <div className="flex flex-col items-center justify-center p-8">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500">No data found</p>
    </div>
);

export const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
        <IoRefreshOutline
            color="#4B5563"
            height="32px"
            width="32px"
            className="animate-spin"
        />
    </div>
);