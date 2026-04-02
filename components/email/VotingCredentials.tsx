import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Column,
  Row,
} from '@react-email/components';

interface VotingCredentialsProps {
  name: string;
  nim: string;
  password?: string;
  loginUrl?: string; // Kept as optional but unused in UI per user request
}

export const VotingCredentialsEmail: React.FC<Readonly<VotingCredentialsProps>> = ({
  name,
  nim,
  password,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>LEADER ELECTION 2026</Heading>
          <Text style={headerSubtitle}>Polytechnic English Conversation Club</Text>
        </Section>
        
        <Section style={bodySection}>
          <Text style={greeting}>Hello, <span style={{ color: '#4A0E17', fontWeight: 'bold' }}>{name}</span></Text>
          <Text style={message}>
            You have been officially registered to participate in the upcoming Leader Election. 
            Below are your official credentials to cast your vote on-site.
          </Text>

          <Section style={credentialsCard}>
            <Row>
              <Column style={credentialLabelCol}>
                <Text style={credentialLabel}>NIM</Text>
              </Column>
              <Column>
                <Text style={credentialValue}>{nim}</Text>
              </Column>
            </Row>
            {password && (
              <Row>
                <Column style={credentialLabelCol}>
                  <Text style={credentialLabel}>Password</Text>
                </Column>
                <Column>
                  <Text style={credentialValue}>{password}</Text>
                </Column>
              </Row>
            )}
          </Section>

          <Text style={warningText}>
            <strong>Important:</strong> Please keep these credentials secure. You will need them 
            to authenticate yourself at the voting booth. Do not share them with anyone.
          </Text>
        </Section>

        <Hr style={divider} />
        
        <Section style={footer}>
          <Text style={footerText}>
            &copy; 2026 Polytechnic English Conversation Club. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '40px 0',
};

const container = {
  margin: '0 auto',
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
};

const header = {
  backgroundColor: '#4A0E17',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderBottom: '4px solid #D4AF37',
};

const headerTitle = {
  color: '#ffffff',
  margin: '0',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '2px',
};

const headerSubtitle = {
  color: '#D4AF37',
  margin: '10px 0 0 0',
  fontSize: '16px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const bodySection = {
  padding: '40px 30px',
};

const greeting = {
  fontSize: '20px',
  color: '#333333',
  margin: '0 0 15px 0',
};

const message = {
  fontSize: '16px',
  color: '#555555',
  lineHeight: '1.6',
  margin: '0 0 30px 0',
};

const credentialsCard = {
  backgroundColor: '#FFFDF9',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 30px 0',
};

const credentialLabelCol = {
  width: '100px',
};

const credentialLabel = {
  color: '#6B4F43',
  fontSize: '14px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  margin: '10px 0',
};

const credentialValue = {
  color: '#4A0E17',
  fontSize: '18px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  margin: '10px 0',
  backgroundColor: 'rgba(212, 175, 55, 0.1)',
  padding: '4px 10px',
  borderRadius: '4px',
  display: 'inline-block',
};

const warningText = {
  fontSize: '14px',
  color: '#8A1538',
  lineHeight: '1.5',
  backgroundColor: 'rgba(138, 21, 56, 0.05)',
  padding: '15px',
  borderRadius: '6px',
  margin: '0',
};

const divider = {
  borderColor: '#eeeeee',
  margin: '0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#fafafa',
};

const footerText = {
  fontSize: '12px',
  color: '#999999',
  margin: '0',
};

export default VotingCredentialsEmail;
