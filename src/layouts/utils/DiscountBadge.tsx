
interface DiscountProps{
    discount:number
}
const DiscountBadge:React.FC<DiscountProps>=({discount})=> (
    discount > 0 ? (
        <div className="discount-percent"
        style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px'
        }}>
                -{discount}%
        </div>
    ) : null
);

export default DiscountBadge;