import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";

export default function Header() {
  const { account, disconnect } = useWallet();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border flex justify-between px-4 p-2">
      <div className=" flex flex-row items-center gap-2">
        <img src={"./aptos-seeklogo.png"} alt="Aptos Logo" className="h-16" />{" "}
        <p className="text-3xl font-bold">Aptos</p>
      </div>
      {account ? (
        <div className="flex flex-col items-end bg-zinc-100 rounded-md px-6 py-2">
          <p className="font-semibold">{`${account.address.slice(
            0,
            6
          )}...${account.address.slice(-4)}`}</p>
          <p
            onClick={() => disconnect()}
            className="cursor-pointer text-black/50"
          >
            Disconnect
          </p>
        </div>
      ) : (
        <ShadcnWalletSelector />
      )}
    </div>
  );
}
