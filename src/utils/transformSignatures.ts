// Function to transform the signature from a string to a vector<vector<u8>>
// Where each byte sequence is represented as a vector of decimal values.
export default function transformSignatures(hexSignatures: any) {
  return hexSignatures.map((signature: any) => {
    // Remove the "0x" prefix if present
    const cleanSignature = signature.startsWith("0x")
      ? signature.slice(2)
      : signature;

    // Convert the hex signature to c
    const byteArray = [];
    for (let i = 0; i < cleanSignature.length; i += 2) {
      byteArray.push(parseInt(cleanSignature.substr(i, 2), 16));
    }

    return byteArray;
  });
}
