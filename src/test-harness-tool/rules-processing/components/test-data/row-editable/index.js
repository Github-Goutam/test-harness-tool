import React, {useState, useEffect} from 'react';
import { Form, Button, Modal } from 'react-bootstrap'
import styles from './row-editable.scss'

function RowEditable(props) {
    
  const { data, rowEdit, rowIndex } = props
  const [state, setState] = useState(data)
  const [show, setShow] = useState({popup: false, modal: false})
  const oldData = {...data}
  
  function handleEdit() {
	  setShow({...show, popup: true})
  }
  function handleCancel() {
	  setState({...state, ...oldData})
	  setShow({popup: false, modal: false})
  }
  function handleSave() {
	  setShow({...show, modal: true})
  }
  function modalSave() {
	  setState({...state})
	  rowEdit(state, rowIndex)
      setShow({popup: false, modal: false})	  
  }
   
  const onNumberUpdated = (label) => (e) => {
	  const data = e.target.value;
	  const regex = /^[\d]+$/g
	  if (data === "" || (data && regex.test(data))) {
	    setState({...state, [label]: data})
	  }
  }
  
  useEffect(() => {
	  setState(data)
  },[data]);
  
  return (
  <>
   <tr>
   {show.popup ?
    <>
		<td>{state.id}</td>
		<td>{state.applicationIdentity}</td>
		<td>{state.bankDivision}</td>
		<td>{state.productFamily}</td>
		<td>{state.productName}</td>
		<td><Form.Control type="text" value={state.barrowAmount} onChange={onNumberUpdated('barrowAmount')} /></td>
		<td><Form.Control type="text" value={state.termFactor} onChange={onNumberUpdated('termFactor')} /></td>
		<td><Form.Control type="text" value={state.riskFactor} onChange={onNumberUpdated('riskFactor')} /></td>
		<td>
		  <div className={styles.alignIcon}><img width="20" height="20" alt="Save" title="Save" onClick={handleSave} src="data:image/png;base64,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" /></div>
		  <div className={styles.alignIcon}><img className={styles.cancelIcon} width="20" height="20" alt="Cancel" title="Cancel" onClick={handleCancel} src="data:image/jpeg;base64,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" /></div>
	     </td>
    </> : 
	<>
		<td>{state.id}</td>
		<td>{state.applicationIdentity}</td>
		<td>{state.bankDivision}</td>
		<td>{state.productFamily}</td>
		<td>{state.productName}</td>
		<td>{state.barrowAmount}</td>
		<td>{state.termFactor}</td>
		<td>{state.riskFactor}</td>
		<td>
		 <img width="20" height="20" alt="Edit" title="Edit" onClick={handleEdit} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8AAAD19fVLS0vPz8/FxcU2NjbZ2dn4+Ph8fHxtbW37+/tdXV35+fnBwcGxsbE7Ozvv7++6urrJycmurq4cHBwpKSlAQECQkJAvLy8iIiJERESGhoYXFxednZ3n5+cMDAxycnKVlZVVVVVeXl7e3t5JSUmjo6NwcHCendi2AAAIdUlEQVR4nO2da3eiMBBAfUB9YFV8FVt8VLTu//+Fq5V2mTCQASaJ7Jn7rWeR9UqSSSYh6XQEQRAEQRAEQRAEQRAEQRAEQfjvCIY9s7w6lBsOVvE4+ZjPX8wxn38ln6fFgfJ9bj9HwKgXLs7rrj3mkdcr+zqvXvx2u2ydXEk/hpaeF20t6j1IVsVffjA6/ly2uZb+FES/eGPd785kUPCN/H72slHTx3iJXpz43fjEv9F0rlzWSDGYnt3Y3VmjBdBXf/Fjk6fY2zt7gPevHmKCH/nr6j/FMN45EPsloQne+MR+CwKHsW0nwBZpaaYFZepcS/EwsWuk8OEhgvOiqyc1FEOHbcyN/rKKYLc7rlwXeyN7Ngh9v5rgrS5eqgkGe1suKB/IE8yFCcixouLCfj8twwtWB980H6oWNC5oK7M+RzN/6ZljOV3Fybrbx/prhEJVIWgMI+Tzyaxm1KlGEB7wUVGsVxyTv6GfL6PJlM2hLgRFatAIc+3oJrby/MoZRvouFjFoLN+Vz81XnMPp2vQi/TCc1NwM1eIwXzyF4K1wURQJQeOgBJ7NczzBO6G+oFKCxkz5SDS08N0L8ffZv3qE5makbTOUIUXitJHx37px9u+AoHjVlLkQlvW10zDxPVyKQRZVr7jRVMUlvPxsUkBH2tmOsvmMQF8XT+V3PcGrF0YVyvkZTeyibE3RB4238tvCarhrno+szb8R/Roo6oNG+X1hJsRhIfUz48E1KKjaoFF+Y5j/jYxKlOGD4dIxyjaQPWxoQDaEP8/MqEUJvjoeBEEj1++qYgivRcaiVkCyavSgsS6/N7y4aPLAMGhOBtTFTnxELnkwLr/5MxjiSSdq0DhqOilPYFiUVSMGjU9NhHNvWJxVIwUNLJcMcG6Ya0Uz7KJscxNGSF3cakezrg3h5Mt2P4V5PxA0kMHUu34069jQB3Xw61bigqRYMRc0Niv9f+HWEDYy/e8qNYVfqSxobCg9FKeGMLP9EFSTwUfQooIM3DupC+bScJorojc8daVEYdDYEopox6khDBNpq7/MT/sWKG6JKTN3hrCI/gj2u3l2Slz8rovbGXHNmDNDuuCtLsKgcR9M0ZOergzROogU0RQYNCJiI/ONI0M4XEpb0WXJtG8MgkZUYSDrxhA+wSQVLJsVhUGjCk4MsUBf+gS76mCqAi4MYRF9IzzBO+uaig4M4RMsb0WhYq1cp33DKmECcozrTItZN/SxJ+gVhglIrLk5hm3DymECUiOha9mwepgAVAj0v9g1rBMmMlAGvDmsGk6x0YRHFiQOlxRsGuLDpS+y4KzWCgOLhvXDRCpY7xUbe4YwbZj2ZDzyEyRk1XCsGTYME6SkE4otQzxMWBC0ZdgwDjYQtGSIdrZNh4kUK4ZuwkSKDUNHYSLFgqHfTLB2mEgxb4iHCSuNzDfGDaGgzTCRYtrQwXBJwbBhw+FSozCRYtaQOvlSJNgoTKQYNXQbJlJMGjYUZFpxbtCw4uRLTpBpkZ05Q2fDJQVjhsoTfLyA55HDxJptmaQpQ1gHd4/vSxeslVXDMWSoLOV6rKenZrZ54uAPZgzVpVy7+zeuECZWjPu6GDHMv0c/n11m5PHghlPQiCG2GG+3Ie9n8M5YRDtGDIs2CiDCFiZS+A3LXzPXwjCagLAbNhRkDBMp3IYNiyhnmEhhNtRsFKAV5BguKfAaKq1o1f20eMNECquhItj3qm230TSrhsNpqNTBya2rVkWRO0ykMBoqrej5frNhybsudgQZDTHBCnszmRLkM1QEf/dfIyoaCBMpXIZKmEj+3SmkFFQTYSKFyVDZTwbsyBLq38fmyarh8BiWCRL2aDK6jwOL4StUSHK3+SwXNPrqKovhEBgimzwGZXXRrKABwzN2k5IWlX24pMBuWLBNZ6EiFiYOS58v68dtuCt64fGAF1TszZfB58umf+XaY4Xb8L1wpTIaNLCs2iBhLbz2DLGggYWJS5p0HDNFEIuGnUBVxLJql5/O0YRpjw6bhp0D3HQLCxOD397f0xr+vhSRL2QHuMEmVtMyaxWf1XC3Xz24XtWbXeBOMVhWzcu8BPyshhn28Cle/oB/xeKgl32Ru3WGl08QD7EwATf6bZvhAT5BNKvmg25PywxDWAfxyZcFuKZdhge4jUDBaKLFhopgUYesvYZqmCjqcbbWUBEszqq1z/Dxj2ocLM6qtc7wFN7PkhkoT7Akq9Y6w/f5HbhJcenkS+sMEcqTTv+BoSar1n5DXdqw9YbayZe2G+onX1puSJh8abchZY4ebkt9NmKIHDRBQW9ImZsIVtCQKSXMsn+p1pA0+fIK9zTmypey7EEbXMflkH45JWNccIhXZeCiz0nNuwTDckg3CeEK2zp7YGAoe0G73JHdA6mq45XptsoOd842Eu7c97fKwrY7vAcNJ+4ORgjhKGTLc5zj7b5wKmHnblN2ZXd47By2evxRbsz101VloEyg7vUfIQK7St1jzNSVqEjuWDS+ae6Dsmp5wza9XIXcDrpffPfOnfb04uAYlvCkHufDuczNU4972lp/imGUO6+IsznIryBY689uYWUwzq1E4Qr3D5b51edvFk9ECvb583m/eFv04ISsdHm7XljPicb/56A3iJDzh9mj8gU9wHKdxNeFb5LFftRHlxHxn4rW8C0JbvJrG5tzJa83t8CLiZ4jegSiI3a6I6rq0XN7GnCWk6EGLnwWRa6hPaLo9sDcH0yeVpTvOtlny9uXUeldya/LGyIx3ZUKlk4r43pkYQvcw95d7O/bOZ93OIjcnO8831c8abuB4+Vk/zl+XQsOPjYl6Y3m9rpxu340cJDDDC6z02g86RslmYxH+4Wr5N43rz2zPM25vIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgtJa/k7mbi137JegAAAAASUVORK5CYII=" />
		</td>
    </>
   }
   </tr>
   <Modal show={show.modal} onHide={handleCancel}>
        <Modal.Body>Will confirm to save?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" onClick={modalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
   </>
  );
}

export default RowEditable;
