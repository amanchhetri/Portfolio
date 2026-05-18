import { motion } from 'framer-motion';
import { stagger } from '../utils/motion';
import { styles } from '../styles';
import { cn } from '../lib/cn';

const SectionWrapper = (Component, idName, sectionClassName) => {
  function HOC() {
    return (
      <motion.section
        id={idName}
        variants={stagger(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className={cn(styles.section, sectionClassName)}>
        <div className={styles.inner}>
          <Component />
        </div>
      </motion.section>
    );
  }
  return HOC;
};

export default SectionWrapper;
