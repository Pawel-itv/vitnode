import { AutoFormInputComponentProps } from '../type';
import { AutoFormLabel } from './common/label';
import { AutoFormTooltip } from './common/tooltip';
import { AutoFormWrapper } from './common/wrapper';

import { FormControl, FormMessage } from '../../form';
import { FileInput } from '../../file-input';

export const AutoFormFile = ({
  autoFormProps: { isRequired, fieldConfigItem, field, theme },
  ...props
}: AutoFormInputComponentProps &
  Omit<React.ComponentProps<typeof FileInput>, 'onChange' | 'value'>) => {
  return (
    <AutoFormWrapper theme={theme}>
      {fieldConfigItem?.label && (
        <AutoFormLabel
          label={fieldConfigItem.label}
          isRequired={isRequired}
          theme={theme}
        />
      )}
      <FormControl>
        <FileInput {...field} {...props} />
      </FormControl>
      {fieldConfigItem.description && (
        <AutoFormTooltip
          value={field.value}
          description={fieldConfigItem.description}
        />
      )}
      <FormMessage />
    </AutoFormWrapper>
  );
};
