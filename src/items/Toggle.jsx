export const Toggle = ({completed, onToggle}) => {

    return (
        <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}/>
    )
}

export default Toggle