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
  schemaData: Record<string, unknown> | undefined;
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
          <List key={key}>
            <ListItem key={key}>
              <List key={key}>
                {value.map((item, index) => (
                  <ListItem key={index}>
                    {typeof item === 'object' && item !== null ? (
                      renderSchemaData(
                        item as Record<string, unknown>,
                        depth + 1,
                      )
                    ) : (
                      <Typography>{JSON.stringify(item)}</Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </ListItem>
          </List>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <List key={key}>
            <ListItem key={key}>
              <Box pl={2}>
                <List>
                  {renderSchemaData(
                    value as Record<string, unknown>,
                    depth + 1,
                  )}
                </List>
              </Box>
            </ListItem>
          </List>
        );
      } else {
        return (
          <List key={key}>
            <ListItem key={key}>
              <ListItemText
                primary={<strong>{key}:</strong>}
                secondary={JSON.stringify(value)}
              />
            </ListItem>
          </List>
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
        data-testid="introspection-drawer"
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
