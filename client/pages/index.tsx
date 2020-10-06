import Home, {
  // getServerSideProps as reExportgetServerSideProps,
  getStaticProps as reExportGetStaticProps,
} from './home/index';

export default Home;
// export const getServerSideProps;
export const getStaticProps = reExportGetStaticProps;
