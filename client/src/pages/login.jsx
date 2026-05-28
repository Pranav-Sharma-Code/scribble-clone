import React,{useState} from 'react'
import Avatar from '../components/avatar'
import { useNavigate } from 'react-router-dom';
import Playground from './playground.jsx';
import CreateRoom from '../components/createroom.jsx';
import Join from '../components/join.jsx';

function Login(){

   const [openCreateRoom, setOpenCreateRoom] = useState(false);
   const [openJoin, setOpenJOin] = useState(false);

    // Name
    const [name, setName] = useState(
        localStorage.getItem("name") || ""
    );

    // Avatar
    const emoji_array =[
        '🙂','😎','💀','😁','😡','🫣','🌚','😋','😉',
        '😍','🫡','😪','😌','🥸','🤠','🤡','😇',
        '🤖','👾','👽','👻','🦁','🦊'
      ];
    
    const[index, setIndex] = useState(
        Number(localStorage.getItem("emojiIndex")) || 0
    );
    
    const leftClick = () => {
        const newIndex = (index-1+emoji_array.length)%emoji_array.length;
        setIndex(newIndex);
        localStorage.setItem("emojiIndex",newIndex)
      };
    
    const rightClick = () => {
        const newIndex = (index+1)%emoji_array.length;
        setIndex(newIndex);
        localStorage.setItem("emojiIndex",newIndex)
      };
      
    const navigate = useNavigate();


  return (
    <>
        <div className="bg-purple-400 p-6 gap-20 grid justify-center items-center w-[90vw] max-w-[400px] min-h-[500px] rounded-3xl" >

        <div className="bg-purple-500 p-1  w-full h-[200px] flex items-center justify-between rounded-3xl">
          <button onClick={leftClick}>
            <span className="material-symbols-outlined p-4 text-white
                  hover:scale-125 transition"
                 style={{ fontSize: "60px" }}
            >
              arrow_back_ios
            </span> 
          </button>

          <div className='flex flex-col items-center h-40' >
          <div className='text-6xl sm:text-7xl md:text-8xl'>
            <Avatar emoji={emoji_array[index]} />
          </div>
          <span className='font-bold text-3xl font-stretch-semi-expanded flex justify-center translate-y-4  text-emerald-50'>
            <Avatar name={name} />
          </span>
          </div>

          <button onClick={rightClick}>
            <span className="material-symbols-outlined p-4 text-white
                  hover:scale-125 transition"
                 style={{ fontSize: "60px" }}
            >
              arrow_forward_ios
            </span> 
          </button>
        </div>
         <input type="text" placeholder='...name(max-length 8)' maxLength={8} className='bg-purple-200 
                rounded-2xl p-2 w-full max-w-[250px] mx-auto'
                value={name} onChange={(event) =>{
                    setName(event.target.value);
                    localStorage.setItem("name", event.target.value);
                }} 
          />

        <div className='flex justify-center gap-10'>

          <button className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold
                  hover:scale-90'
                  onClick={()=>setOpenJOin(false)} >
              Join
         </button>

         {/* <div>
            <Join open={openJoin} setOpen={setOpenJOin}/>
         </div> */}

         <button className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold
                  hover:scale-90
          '  onClick={() => setOpenCreateRoom(false)}>
              Create
         </button >

        {/* <div>
          <CreateRoom open={openCreateRoom} setOpen={setOpenCreateRoom} />
        </div> */}

         <button className='bg-blue-900 p-2 px-4 py-2 text-white rounded-3xl font-bold
                 hover:scale-90'
                 onClick={() => navigate("/playground")}       
          >
              Play
         </button>

        </div>
      </div>
    </>
  )
}

export default Login;
