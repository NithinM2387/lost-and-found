function ItemCard(props) {
    return (
        <div className="item-card" onClick={props.onClick}>
            <h3>{props.name}</h3>
            <p>Type: {props.type}</p>
            <p>Location: {props.location}</p>
            <p>category: {props.category}</p>
            <p>Description: {props.description}</p>
            <p>Date: {props.date}</p>
        </div>
    )

}

export default ItemCard