// ... imports

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import logo from "../../../public/logo.png";

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
`;

const BrandName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
`;

// Inside your Component:
<LogoContainer href="/">
  <LogoIcon>
    <Image src={logo} alt="sijil logo" />
  </LogoIcon>
  <BrandName>Sijil</BrandName>
</LogoContainer>;
