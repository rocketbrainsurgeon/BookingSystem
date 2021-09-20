import * as React from 'react';
import {useEffect, useState} from 'react';
import {Room, User, Reservation, ABI} from "./entities";
import { ethers, BigNumber } from "ethers";
import EthersContext from "./EthersContext";
import * as CONFIG from "./env.json";
import DatePicker from "react-datepicker";
import { Tailwind, FAQ } from "./Tailwind";
import "react-datepicker/dist/react-datepicker.css";

declare const window: any;

interface Info {
  rooms: Room[],
  users: User[],
  reservations: Reservation[],
  signedUp: boolean
}

interface InfoProps {
  info: Info,
  //callback?: React.Dispatch<React.SetStateAction<Info>>
  callback : () => Promise<void>
}

//reservations
const Reservations = ({info, callback}: InfoProps): JSX.Element => {
  const connection = React.useContext(EthersContext);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const cancel = (reservation: Reservation) => {
    const d = async () => {
      const [,provider] = await connection.connect();
      const contract = new ethers.Contract(CONFIG.ADDRESS, ABI, provider.getSigner());
      setDisabled(true);
      const tx = await contract.cancel([reservation.room.name],reservation.date/1000,reservation.user.address);
      const receipt = await tx.wait();
      setDisabled(false);
      await callback();
    }
    d();
  };

  const listItem = (r: Reservation): JSX.Element => {
    const date = new Date(r.date);
    const user: User | undefined = info.users.find(u=>u.address === r.user.address);
    return <div className="my-1">{r.room.name} on {date.toLocaleString()} {user ? <button onClick={()=>cancel(r)} disabled={disabled} className="border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 float-right">{!disabled ? "Cancel" : "Working..."}</button> : null}</div>;
  }
  
  return <div>{info.reservations && info.reservations.length > 0? info.reservations.map(r=>listItem(r)) : "No upcoming reservations"}</div>;
}

interface ReserveInputs {
  room: string,
  date: Date
}

const Reserve = ({info, callback}: InfoProps): JSX.Element => {
  const [state, setState] = useState<ReserveInputs>({room:"",date:new Date()});
  const [excludes, setExcludes] = useState<Date[]>([]);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const connection = React.useContext(EthersContext);

  const getSelect = (): JSX.Element => {
    return <select value={state.room} onChange={(e)=>setState({room:e.target.value,date:state.date})} className="block w-full my-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md">{info.rooms.map(r=><option value={r.name}>{r.name} Room</option>)}</select>;
  }

  const reserve = () => {
    const d = async () => {
      if(state.date.getUTCSeconds() !== 0 || state.date.getUTCMinutes() !== 0) {
        //they likely didn't pick a date and time, or tried to input something illegal like 8:01 PM
        alert("Date formatted incorrectly. Please pick a date & time from the calendar.");
        return Promise.reject();
      }
      console.log(state);
      const [,provider] = await connection.connect();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONFIG.ADDRESS, ABI, signer);
      setDisabled(true);
      const tx = await contract.reserve(state.room,state.date.valueOf() / 1000,await signer.getAddress());
      const receipt = await tx.wait();
      setDisabled(false);
      callback();
    }
    d();
  };

  const excludeTimes = (): Date[] => {
    const isSameDay = (x: Date, y: Date): boolean =>{
      return x.getUTCDate() === y.getUTCDate() && x.getUTCMonth() === y.getUTCMonth() && x.getUTCFullYear() === y.getUTCFullYear();
    }
    const reservations: Reservation[] = info.reservations.filter(r=>r.room.name === state.room && isSameDay(new Date(r.date),state.date));
    return reservations.map(r=>new Date(r.date));
  }

  useEffect(()=>{
    if(info && info.rooms.length > 0) {
      if(state.room === "") setState(previous=>{return {room:info.rooms[0].name,date:previous.date}});
      setExcludes(excludeTimes());
    }
  },[info, state]);

  //assumption: can't book same day
  const filterPassed = (date: Date): boolean => {
    const current = new Date();
    const selected = new Date(date);
    return current < selected;
  }

  const datePicker = (): JSX.Element => {
    return <div><DatePicker selected={state.date} showTimeSelect filterDate={filterPassed} filterTime={filterPassed} timeIntervals={60} excludeTimes={excludes} dateFormat="MMMM d, yyyy h:mm aa" onChange={(date: Date) => setState(previous=>{return {room:previous.room,date:date}})} className="block w-full shadow-sm mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/></div>;
  }
  
  return <div>
    <div>{getSelect()}</div>
    {datePicker()}
      <div><button onClick={()=>reserve()} disabled={disabled} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{!disabled ? "Reserve" : "Working..."}</button>
      </div>
    </div>;
}

const GetMetaMask = (): JSX.Element => {
  return <div><div className="my-4">Hmm... I can't find any web3 wallet installed, and this dapp requires one.</div>
      <button onClick={()=>window.location = "https://metamask.io"} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Get MetaMask</button>
    </div>;
}

const App = (): JSX.Element => {
  const [account, setAccount] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<Info>({rooms:[],users:[],reservations:[],signedUp:false});
  const connection = React.useContext(EthersContext);

  const getContract = async (): Promise<[ethers.providers.JsonRpcSigner,ethers.Contract]> => {
    const [,provider] = await connection.connect();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONFIG.ADDRESS, ABI, signer);
    return [signer, contract];
  }

  const getRooms = async(): Promise<Room[]> => {
    const [, contract] = await getContract();
    const temp: string[] = await contract.getRooms();
    const rooms: Room[] = temp.map(t=>{return {name:t}});
    return rooms;
  }
  
  const getReservations = async (): Promise<Reservation[]> => {
    const [, contract] = await getContract();
    const [rooms, dates, users] = await contract.getReservations();
    const reservations: Reservation[] = rooms.map((r: Room,i:number)=>{return {room:{name:r},user:{address:users[i]},date:BigNumber.from(dates[i]).toNumber()*1000}});
    return reservations;
  }

  const getUsers = async (reservations : Reservation[]): Promise<User[]> => {
    //reservations don't contain user.name by default, so we piece it together
    //in hindsight, I'd refactor contract.getReservations() to return a tuple with all necessary info
    let users = new Array<User>();
    if(reservations && reservations.length > 0) {
      const [, contract] = await getContract();
      for(let i = 0; i < reservations.length; i++) {
        const address = reservations[i].user.address;
        if(users.findIndex(u=>u.address === address) < 0)
          users.push({address:address,name:await contract.users(address)});
      }
    }

    return users;
  }

  const signedUp = async (): Promise<boolean> => {
    const [signer, contract] = await getContract();
    const name = await contract.users(await signer.getAddress());
    return name !== "";
  }

  const getAll = async (): Promise<void> => {
    const rooms = await getRooms();
    const reservations = await getReservations();
    const users = await getUsers(reservations);
    const isSignedUp = await signedUp();
    setInfo({rooms:rooms,users:users,reservations:reservations,signedUp:isSignedUp});

    return Promise.resolve();
  }

  const getAccount = async (prompt?: boolean) => {
    const [a, ] = await connection.connect(prompt);
    if(a.length > 0) {
      setAccount(a[0]);
      getAll();
    }
  }  

  useEffect(()=>{
    getAccount();
  },[]);

  const Connect = (): JSX.Element => {

    return <div>
        <button onClick={async ()=>{await getAccount(true)}} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Connect</button>
      </div>;
  }

  const SignUp = (): JSX.Element => {
    const [name,setName] = useState<string>("");
    const [disabled, setDisabled] = React.useState<boolean>(false);

    const signUp = async (name: string): Promise<void> => {
    
      if(name) {
          const [signer,contract] = await getContract();
          const contractWithSigner = contract.connect(signer);
          setDisabled(true);
          const tx = await contractWithSigner.giveAccess(await signer.getAddress(), name);
          const receipt = await tx.wait();
          await getAccount();
          setDisabled(false);
        } else {
          alert("Please input your name.");
        }
      }

      const input = (): JSX.Element => {
        return <div><input type="text" placeholder="Your Name Here" value={name} onChange={(e)=>setName(e.target.value)} className="block w-full shadow-sm mb-4 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/></div>;
      }

      const button = (): JSX.Element => {
        return <button onClick={async ()=>{await signUp(name);}}  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{!disabled ? "Sign Up" : "Working..."}</button>;
      }
    return <div>{input()}<div>{button()}</div></div>;
  }

  return <div className="max-w-full"><Tailwind reservations={<Reservations info={info} callback={getAll}/>} reserve={!window.ethereum ? <GetMetaMask/>: account == null ? <Connect/> : !info.signedUp ? <SignUp/> : <Reserve info={info} callback={getAll}/>}/><FAQ/></div>;
}

export default App;