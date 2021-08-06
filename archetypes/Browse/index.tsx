import { FilterContext, noDispatch, defaultState } from "@context/FilterContext"
import { Pool } from "@hooks/usePool"
import { SHORT, SideType } from "@libs/types/General"
import React, { useState } from "react"
import { useContext } from "react"
import styled from "styled-components"
import FilterSelects from "./FilterSelects"
import PoolsTable from "./PoolsTable"
import TradeModal from "./TradeModal"

export const Browse:React.FC = () => {
	const { filterState, filterDispatch } = useContext(FilterContext);
	const [showModal, setShowModal] = useState(false);
	const [focusedPool, setFocusedPool] = useState<{
		pool: Pool | undefined,
		token: SideType
	}>({
		pool: undefined,
		token: SHORT
	});
	return (
		<Container className="container">
			<Title>Perpetual Pool Tokens</Title>
			<FilterSelects 
				filterState={filterState ?? defaultState }
				filterDispatch={filterDispatch ?? noDispatch}
			/>
			<PoolsTable
				pools={filterState?.filteredPools ?? []} 
				openTradeModal={(focusedPool, focusedToken) => {
					setShowModal(true)
					setFocusedPool({
						pool: focusedPool,
						token: focusedToken
					})
				}}
			/>
			<TradeModal show={showModal} onClose={() => setShowModal(false)} pool={focusedPool}  />
		</Container>
	)
}

const Title = styled.h1`

`

const Container = styled.div`
	justify-content: center;
	margin-top: 10vh;
`