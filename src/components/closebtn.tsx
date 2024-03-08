interface QrCodeProps {
    close: (val: boolean) => void;
}

const CloseBtn = (props: QrCodeProps) => {
    return (
    <div onClick={()=> props.close(false)} className="flex cursor-pointer items-center justify-center text-3xl text-white caret-transparent ">
        <div className="group relative inline-flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full font-medium shadow-md">
        <span className="ease absolute z-10 flex h-full w-full translate-y-full items-center justify-center rounded-full bg-[#535C91] text-white duration-300 group-hover:translate-y-0"></span>
        <div className="absolute z-50 flex h-full w-full items-center justify-center text-[#f6f2f2] group-hover:text-white">
        <svg height="20px" width="20px" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M 19 15 C 17.977 15 16.951875 15.390875 16.171875 16.171875 C 14.609875 17.733875 14.609875 20.266125 16.171875 21.828125 L 30.34375 36 L 16.171875 50.171875 C 14.609875 51.733875 14.609875 54.266125 16.171875 55.828125 C 16.951875 56.608125 17.977 57 19 57 C 20.023 57 21.048125 56.609125 21.828125 55.828125 L 36 41.65625 L 50.171875 55.828125 C 51.731875 57.390125 54.267125 57.390125 55.828125 55.828125 C 57.391125 54.265125 57.391125 51.734875 55.828125 50.171875 L 41.65625 36 L 55.828125 21.828125 C 57.390125 20.266125 57.390125 17.733875 55.828125 16.171875 C 54.268125 14.610875 51.731875 14.609875 50.171875 16.171875 L 36 30.34375 L 21.828125 16.171875 C 21.048125 15.391875 20.023 15 19 15 z"></path>
        </svg>
        </div>
        </div>
    </div>
    );
}

export default CloseBtn;