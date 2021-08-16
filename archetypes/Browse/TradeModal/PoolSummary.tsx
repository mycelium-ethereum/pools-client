
import styled from 'styled-components';
import { Pool } from '@hooks/usePool';

export default (({ pool }) => {
	console.log(pool)
	return (
		<Summary>

		</Summary>
	)
}) as React.FC<{
	pool: Pool
}>

const Summary = styled.div``


