import { Grid } from '@material-ui/core';
import { layoutLeanTypes } from '@types/cartes';
import Preloader from 'components/Preloader/Preloader';
import MySpace from 'modules/myaccount/MySpace/Common';
import { nameUpperCase } from 'modules/myaccount/MySpace/util';
import MyOrders from 'modules/myaccount/Orders/common/myorders/index';
import * as SC from 'modules/myaccount/styles';
import { getMenuData } from 'modules/NavBar/services';
import { MenuOptions } from 'modules/NavBar/types';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useAuth } from 'shared/contexts/auth';
import { getCSSGlobalPure } from 'shared/layouts/LayoutCalls/cssPureGlobal';
import { getGeneralCSS } from 'shared/layouts/LayoutCalls/generalCSS';
import { getFooterData } from 'shared/layouts/LayoutCalls/generalFooter/getLayoutData';
import { getHeaderData } from 'shared/layouts/LayoutCalls/generalHeader/generalHeader';
import { findLayoutData } from 'shared/layouts/LayoutCalls/utils';
import { isAuthenticated } from 'utils/is-authenticated';

import { Layout } from '../../components/layout/Base';
import { Breadcrumbs } from '../../components/layout/breadcrumbs';
import SideMenuAccount from '../../components/SideMenuAccount';
import SideMenuAddress from '../../components/SideMenuAddress';
interface MinhaContaProps {
  MenuData: MenuOptions[];
  footerGeral: layoutLeanTypes[];
  headerGeral: layoutLeanTypes[];
}

const MinhaConta: React.FC<MinhaContaProps> = ({
  MenuData,
  footerGeral,
  headerGeral,
}) => {
  const { user } = useAuth();
  const [menuSelected, setMenuSelected] = useState('meus-pedidos');
  const [breadcrumb, setBreadcrumb] = useState([
    { text: 'Minha conta', url: '' },
    { text: 'Meus pedidos', url: '' },
  ]);

  React.useEffect(() => {
    const footerJS = new Function(
      findLayoutData('FOOTER_GERAL_JAVASCRIPT', footerGeral)?.content || ''
    );
    footerJS();
  }, []);

  return (
    <>
      {!user && <Preloader active={true} />}
      <Layout
        MenuData={MenuData}
        footer={findLayoutData('FOOTER_GERAL', footerGeral)}
        header={findLayoutData('HEADER_GERAL', headerGeral)}
      >
        <Head>
          <style>
            {ReactHtmlParser(
              findLayoutData('FOOTER_GERAL_CSS', footerGeral)?.content || ''
            )}
          </style>

          <style>
            {ReactHtmlParser(
              findLayoutData('HEADER_GERAL_CSS', headerGeral)?.content || ''
            )}
          </style>
        </Head>
        <SC.BreadCrumbsWrapper>
          <Breadcrumbs items={breadcrumb} />
        </SC.BreadCrumbsWrapper>

        <SC.MyAcountContainer>
          <SC.Heading>
            <SC.TitleUser>
              <strong>{`Olá, ${nameUpperCase(user?.name)}`}</strong>
            </SC.TitleUser>
            <SC.SubTitleUser>
              Aqui você encontra todas as informações sobre seus pedidos e
              cadastro.
            </SC.SubTitleUser>
            <SC.Divider />
          </SC.Heading>
          <Grid container spacing={2} style={{ marginTop: '5px' }}>
            <Grid item sm={3} md={2} xs={12}>
              <SideMenuAccount
                setMenuSelected={setMenuSelected}
                setBreadcrumb={setBreadcrumb}
              />
            </Grid>
            <Grid item sm={9} md={10} xs={12} style={{ marginBottom: 70 }}>
              <SC.ItemsMenuContainer
                menuSelected={menuSelected}
                menuName="meus-pedidos"
              >
                {user && <MyOrders user={user.cpf} />}
              </SC.ItemsMenuContainer>
              <SC.ItemsMenuContainer
                menuSelected={menuSelected}
                menuName="meu-espaco"
              >
                <MySpace />
              </SC.ItemsMenuContainer>
              <SC.ItemsMenuContainer
                menuSelected={menuSelected}
                menuName="enderecos"
              >
                <SideMenuAddress />
              </SC.ItemsMenuContainer>
            </Grid>
          </Grid>
        </SC.MyAcountContainer>
      </Layout>
    </>
  );
};

export default MinhaConta;

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await isAuthenticated(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/acesso',
      },
    };
  }

  const MenuData = await getMenuData();
  const footerGeral = await getFooterData();
  const headerGeral = await getHeaderData();
  const generalCSS = await getGeneralCSS();
  const pureCSS = await getCSSGlobalPure();

  return {
    props: { MenuData, footerGeral, generalCSS, headerGeral, pureCSS },
  };
};
