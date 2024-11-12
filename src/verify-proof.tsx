import { useState, useEffect } from "react";
import { transformForOnchain } from "@reclaimprotocol/js-sdk";
import { Button } from "./components/Button";
import transformSignatures from "./utils/transformSignatures";
import { ClipLoader } from "react-spinners";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Proof } from "./types/proofTypes";
import {
  useWallet,
  InputTransactionData,
} from "@aptos-labs/wallet-adapter-react";

export default function VerifyProof(props: any) {
  const [proof, setProof] = useState<Proof | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { signAndSubmitTransaction } = useWallet();
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const handleVerifyProof = async () => {
    try {
      if (!proof) {
        setError("Proof data is not available.");
        return;
      }
      setLoading(true);
      const reclaimAddress =
        // Replace with your contract address
        "0xd33b912ac96983caa70ac9f44f7e274d1a29158c71e40c26b967e75e72a11d5f";
      const ownerAddress =
        // Replace with your owner address
        "0x3878a32a3c5b833b1a8271f448e3d9923cf11895d1784ee98270f27414d3db8d";

      // Transforming the Signature from a String to an array of decimal bytes
      // to be compatible with the data type used in the contract vector<vector<u8>>
      const transformedSignatures = transformSignatures(
        proof.signedClaim.signatures
      );
      // Sending the proof as multiple parameters since Entry functions in aptos
      // Can take primitive types, (ex: String, vector) arguments but cannot take Structs (ex :Proof)
      const transaction: InputTransactionData = {
        data: {
          function: `${reclaimAddress}::reclaim::verify_proof`,
          functionArguments: [
            proof.claimInfo.context,
            proof.claimInfo.parameters,
            proof.claimInfo.provider,
            proof.signedClaim.claim.epoch.toString(),
            proof.signedClaim.claim.identifier,
            proof.signedClaim.claim.owner,
            proof.signedClaim.claim.timestampS.toString(),
            transformedSignatures,
            ownerAddress,
          ],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      let transactionData = await aptos.waitForTransaction({
        transactionHash: response.hash,
      });

      setLoading(false);
      setTransactionHash(transactionData.hash);
      setVerified(true);
      console.log("hash", transactionData);
    } catch (error) {
      console.error("Verification failed:", error);
      setLoading(false);
      setError("Verification failed. Please try again.");
      setVerified(false);
    }
  };

  useEffect(() => {
    const newProof = transformForOnchain(props.proof);
    // @ts-ignore
    setProof(newProof);
  }, [props.proof]);

  return (
    <div>
      {!loading && !verified && (
        <Button onClick={handleVerifyProof}>Verify Proof</Button>
      )}
      {loading && <ClipLoader color="#4A90E2" size={50} />}
      {verified && transactionHash && (
        <div className="flex flex-col text-center">
          <p className="text-green-500 font-semibold">
            Verification completed.
          </p>
          <a
            href={`https://explorer.aptoslabs.com/txn/${transactionHash}?network=testnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            See Transaction on the Explorer
          </a>
        </div>
      )}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
