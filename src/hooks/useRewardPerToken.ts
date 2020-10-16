import { useCallback, useEffect, useMemo, useState } from "react";
import { provider } from 'web3-core'
import { useWallet } from "use-wallet";
import { BigNumber } from "ethers/utils";
import { getContract } from "../utils/pool";

export function useRewardPerToken(poolAddress: string) {
    const { account, ethereum } = useWallet()
    const [ rewardPerToken, updateRewardPerToken ] = useState("0")
    const [ lastUpdateTime, updateLastupdate ] = useState("0")


    const contract = useMemo(() => {
        return getContract(ethereum as provider, poolAddress)
    }, [ethereum, poolAddress])

    const update = useCallback(async () => {
        const _rewardPerToken = await contract.methods.rewardPerToken().call();
        const _lastUpdateTime = await contract.methods.lastUpdateTime().call();
        updateRewardPerToken(_rewardPerToken)
        updateLastupdate(_lastUpdateTime.toString())
      }, [contract])
      const _lU = Number(lastUpdateTime) * 1000
      const diffSinceLastUpdate = new Date().getTime() - (_lU)
      const oneYearInMs = 1000 * 60 * 60 * 24 * 365
      const howManyPartInYear = oneYearInMs / diffSinceLastUpdate
      console.log('lastUpdateTime', _lU)
      console.log('howManyPartInYear', howManyPartInYear)
    //   const apy = 0
      const apy = lastUpdateTime === '0' ? 0 :(Number(rewardPerToken) / 1e18) * (howManyPartInYear)

      useEffect(() => {
        if (account && contract) {
            update()
        }
      }, [contract, account, update])

      return { rewardPerToken, update, apy, lastUpdateTime }
}
