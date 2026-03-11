export type Task = {
 id: string;
 name: string;
 status: boolean;
 incomePerTask: number;
 image: string;
 income:number
 taskName: string;
};
 export type Level = {
  level: string;
  // price: string;
  // profit: string;
  unlocked: boolean;
 };

 export type User = {
   id: string;
   name?: string | null;
   inviteCode?: string;
   vip?: string | null;
   taskStartTime?: string | null;
   balance: number;
   totalDeposit: number;
   totalWithdraw: number;
   totalCommission: number;
   vipName?: string | null;
 };

 export type Vip = {
  id: string;
  // name: string;
  price: string;
  profit: string;
  unlocked: boolean;
 };