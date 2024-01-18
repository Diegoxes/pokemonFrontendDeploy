import usePokemon from '../../hooks/usePokemon';
import styles from './Detail.module.css';
import { Profile } from '../../components';

const Detail = () => {
    const pokemon = usePokemon(); //hook use pokemon
    return (
        <>
            <div className={styles.container}>
                
                <div className={styles.header}>
                    Detail Pokémon
                </div>
                <Profile pokemon={pokemon} />
            </div>
        </>
    );
};

export default Detail;