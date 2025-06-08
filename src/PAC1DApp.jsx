import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const contractAddress = "0x6119027bEe1a026cf95bCe4D4Bb99833f06d38b7"
const usdtAddress = "0x853389A18629d3dB579cda79DE6210a313B78212"
const abi = [
  "function invest(uint256 amount, address token, address recipient) external",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)"
]

export default function App() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState(null)

  async function connectWallet() {
    if (!window.ethereum) {
      setError("MetaMask não está instalado.")
      return
    }

    try {
      const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(acc)
      setError(null)
    } catch (err) {
      setError("Erro ao conectar MetaMask.")
    }
  }

  async function invest() {
    if (!account) return
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const usdt = new ethers.Contract(usdtAddress, abi, signer)
    const pac = new ethers.Contract(contractAddress, abi, signer)

    await usdt.approve(contractAddress, 1000e6)
    await pac.invest(1000e6, usdtAddress, account)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>PAC1 dApp</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {account ? (
        <>
          <p>Conectado: {account}</p>
          <button onClick={invest}>Investir 1000 USDT</button>
        </>
      ) : (
        <button onClick={connectWallet}>Conectar MetaMask</button>
      )}
    </div>
  )
}
