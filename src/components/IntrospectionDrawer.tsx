import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';

type IntrospectionDrawerProps = {
  isDrawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  schemaData: Record<string, unknown>;
};

const IntrospectionDrawer = ({
  isDrawerOpen,
  toggleDrawer,
  schemaData,
}: IntrospectionDrawerProps) => {
  const renderSchemaData = (
    data: Record<string, unknown>,
    depth: number = 0,
  ) => {
    return Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        return (
          <ListItem key={key}>
            <List>
              {value.map((item, index) => (
                <ListItem key={index}>
                  {typeof item === 'object' && item !== null ? (
                    renderSchemaData(item as Record<string, unknown>, depth + 1)
                  ) : (
                    <Typography>{JSON.stringify(item)}</Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </ListItem>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <ListItem key={key}>
            <Box pl={2}>
              <List>
                {renderSchemaData(value as Record<string, unknown>, depth + 1)}
              </List>
            </Box>
          </ListItem>
        );
      } else {
        return (
          <ListItem key={key}>
            <ListItemText
              primary={<strong>{key}:</strong>}
              secondary={JSON.stringify(value)}
            />
          </ListItem>
        );
      }
    });
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <div
          style={{ width: 300, padding: 16 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
        >
          <List>
            {schemaData ? (
              renderSchemaData(schemaData)
            ) : (
              <ListItem>
                <ListItemText primary="Loading..." />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default IntrospectionDrawer;
