import { useDispatch, useSelector } from 'react-redux';
import styles from './Msg.module.css';
import { setShowMsg } from '../../redux/actions';

const Msg = () => {
    const message = useSelector((state) => state.showMsg); //estado showMsg
    const dispatch = useDispatch();
    const handleClick = () => { dispatch(setShowMsg({ show: false, type: '', msg: '' })); };





    //cuando creo un personaje me sale un mensaje ese es y el otro mensaje es typo carga
    return (
        <div className={styles.container}>
            {message.type === 'message' ?
                (<>
                    <button type='button' onClick={handleClick} className={styles.btn_close}>Close</button>
                    <div className={styles.description}> 
                        <h3>Message</h3>
                        <span className={styles.text}> {message.msg} </span>
                    </div>
                </>) :
                <>
                    <div className={styles.pokeball}>
                        <div className={styles.pokeball__button}>
                        </div>
                    </div>
                    <div className={styles.text}>
                        L O A D I N G  .  .  .
                    </div>
                </>
            }
        </div>
    );
};
export default Msg;