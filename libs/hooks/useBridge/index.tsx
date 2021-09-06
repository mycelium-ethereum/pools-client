import { useState, useEffect } from "react";
import { Bridge } from 'arb-ts';
import { ethers } from 'ethers'
import { useWeb3 } from "@context/Web3Context/Web3Context";
import { ARBITRUM } from "@libs/constants";
import { useTransactionContext } from "@context/TransactionContext";
// import { useArbTokenBridge } from "token-bridge-sdk";


export default (() => {
	const { signer, network } = useWeb3();
	const { handleTransaction } = useTransactionContext();
	const [bridge, setBridge] = useState<Bridge | null>(null)
	// const { 
	// 	eth: { withdraw: _withdrawEth }, token: { withdraw: _withdrawToken, add: _addToken}, _bridgeTokens 
	// } = useArbTokenBridge(bridge)
		
	useEffect(() => {
		const getBridge = async () => {
			console.debug("Connecting arbitrum bridge")
			// can either be connected to eth bridging to arb or connected to arb bridging to eth
			const l1Provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_L1_RPC)
			const l2Provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_L2_RPC)

			if (signer) {
				let bridge;
				if (network === parseInt(ARBITRUM)) {
					console.debug("Bridging Arbitrum to Mainnet")
					const l1Signer = signer?.connect(l1Provider);
					bridge = await Bridge.init(l1Signer, signer)
				} else {
					console.debug("Bridging Mainnet to Arbitrum")
					const l2Signer = signer?.connect(l2Provider);
					bridge = await Bridge.init(signer, l2Signer)
				}

				// I assume this is how to get approved
				console.log(await bridge.getAndUpdateL1TokenData('0x7d66cde53cc0a169cae32712fc48934e610aef14'), "bridge")

				setBridge(bridge);
			} else {
				console.error("Signer can not be undefined")
			}
		}
		// getBridge();
	}, [])

	const bridgeEth = (amount: number) => {
		if (bridge && handleTransaction) {
			handleTransaction(
				bridge.depositETH, 
				[ethers.BigNumber.from(amount)]
			)
		} else {
			console.error("Failed to bridge token: bridge or transaction handler undefined")
		}
	}

	// takes the token address and an amount to deposit
	// wrote these two to be not be hard fixed to USDC
	const bridgeToken = (token: string, amount: number) => {
		if (bridge && handleTransaction) {
			handleTransaction(
				bridge.deposit, 
				[token, ethers.BigNumber.from(amount)]
			)
		} else {
			console.error("Failed to bridge token: bridge or transaction handler undefined")
		}
	}

	const approve = (token:string) => {
		if (bridge && handleTransaction) {
			handleTransaction(
				bridge.approveToken,
				[token]
			)
		}
	}

	return {
		bridgeToken,
		bridgeEth,
		approve
	}

})