import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FR } from '../../../i18n/fr';
import { AppPlatform, QrContent, SocialNetwork, WifiEncryption } from '../../../models/qr-content.model';
import { WizardStateService } from '../../../services/wizard-state.service';
import {
  appPlatformValidator,
  phoneValidator,
  socialAtLeastOneValidator,
  urlValidator,
  vcardAtLeastOneValidator,
  wifiPasswordValidator,
} from '../../../validators/qr-validators';
import { FieldErrorComponent } from '../../shared/field-error/field-error.component';
import { IconComponent } from '../../shared/icon/icon.component';

const TEXT_MAX_LENGTH = 1000;
const SOCIAL_NETWORKS: SocialNetwork[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'x', 'youtube'];

@Component({
  selector: 'app-step-content',
  standalone: true,
  imports: [ReactiveFormsModule, FieldErrorComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-content.component.html',
})
export class StepContentComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly wizard = inject(WizardStateService);
  private subscription?: Subscription;

  readonly fr = FR;
  readonly type = this.wizard.type();
  readonly socialNetworks = SOCIAL_NETWORKS;
  readonly socialNetworkLabels = FR.content.social.networks;
  readonly textMaxLength = TEXT_MAX_LENGTH;
  readonly wifiEncryptionOptions: WifiEncryption[] = ['WPA', 'WEP', 'nopass'];
  readonly appPlatformOptions: AppPlatform[] = ['auto', 'ios', 'android'];

  form!: FormGroup;

  readonly errorMessages = {
    url: this.fr.content.url.errors,
    text: {
      required: this.fr.content.text.errors.required,
      maxlength: this.fr.content.text.errors.maxlength.replace('{max}', String(TEXT_MAX_LENGTH)),
    },
    vcard: this.fr.content.vcard.errors,
    wifi: this.fr.content.wifi.errors,
    social: this.fr.content.social.errors,
    email: this.fr.content.email.errors,
    sms: this.fr.content.sms.errors,
    pdf: this.fr.content.pdf.errors,
    video: this.fr.content.video.errors,
    app: this.fr.content.app.errors,
  };

  get socialLinks(): FormArray {
    return this.form.get('links') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.subscription = this.form.valueChanges.subscribe((value) => {
      this.wizard.setContent(value as QrContent);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addSocialLink(): void {
    this.socialLinks.push(this.buildSocialLinkGroup({ network: 'instagram', url: '' }));
  }

  removeSocialLink(index: number): void {
    if (this.socialLinks.length > 1) {
      this.socialLinks.removeAt(index);
    }
  }

  back(): void {
    this.wizard.goToStep(1);
  }

  next(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.wizard.setContent(this.form.value as QrContent);
    this.wizard.goNext();
  }

  private buildSocialLinkGroup(link: { network: SocialNetwork; url: string }): FormGroup {
    return this.fb.group({
      network: [link.network, Validators.required],
      url: [link.url, [Validators.required, urlValidator()]],
    });
  }

  private buildForm(): FormGroup {
    const content = this.wizard.content() as any;

    switch (this.type) {
      case 'url':
        return this.fb.group({ url: [content.url, [Validators.required, urlValidator()]] });

      case 'text':
        return this.fb.group({
          text: [content.text, [Validators.required, Validators.maxLength(TEXT_MAX_LENGTH)]],
        });

      case 'vcard':
        return this.fb.group(
          {
            firstName: [content.firstName],
            lastName: [content.lastName],
            phone: [content.phone, phoneValidator()],
            email: [content.email, Validators.email],
            company: [content.company],
            address: [content.address],
          },
          { validators: vcardAtLeastOneValidator() },
        );

      case 'wifi':
        return this.fb.group(
          {
            ssid: [content.ssid, Validators.required],
            password: [content.password],
            encryption: [content.encryption, Validators.required],
            hidden: [content.hidden],
          },
          { validators: wifiPasswordValidator() },
        );

      case 'social':
        return this.fb.group({
          links: this.fb.array(
            (content.links?.length ? content.links : [{ network: 'instagram', url: '' }]).map(
              (link: { network: SocialNetwork; url: string }) => this.buildSocialLinkGroup(link),
            ),
            socialAtLeastOneValidator(),
          ),
        });

      case 'email':
        return this.fb.group({
          to: [content.to, [Validators.required, Validators.email]],
          subject: [content.subject],
          body: [content.body],
        });

      case 'sms':
        return this.fb.group({
          phone: [content.phone, [Validators.required, phoneValidator()]],
          message: [content.message],
        });

      case 'pdf':
        return this.fb.group({ url: [content.url, [Validators.required, urlValidator()]] });

      case 'video':
        return this.fb.group({ url: [content.url, [Validators.required, urlValidator()]] });

      case 'app':
        return this.fb.group(
          {
            platform: [content.platform, Validators.required],
            iosUrl: [content.iosUrl, urlValidator()],
            androidUrl: [content.androidUrl, urlValidator()],
          },
          { validators: appPlatformValidator() },
        );
    }
  }
}
