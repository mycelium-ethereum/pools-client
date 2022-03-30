import { useStore } from ".";

useStore.subscribe(state => state.web3Slice.onboard, console.log)
