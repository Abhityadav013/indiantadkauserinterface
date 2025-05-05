import Image from "next/image";

const VideoLoader = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return (

        <div className="flex items-center justify-center h-screen relative bg-white">
            {/* Fullscreen loading image */}
            <Image
                src="https://testing.indiantadka.eu/assets/loadingGlass.gif"
                alt="loading"
                width={100}
                height={100}
            />
        </div>
    );
};

export default VideoLoader;
